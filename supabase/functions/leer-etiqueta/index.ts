// Función de Supabase «leer-etiqueta»: recibe la foto de una lata, comprueba los límites
// (SQL 58, gastar_lectura_foto) y devuelve el texto que lee Google Cloud Vision.
// Secreto necesario en Supabase (Edge Functions → Secrets): GOOGLE_VISION_KEY.
// La foto no se guarda en ningún sitio: se envía a Google y se descarta.

const ORIGENES = ["https://elherbariodelacomarca.es", "https://www.elherbariodelacomarca.es"];
const MAX_BASE64 = 2_000_000; // unos 1,5 MB de imagen

function cabeceras(req: Request) {
  const origen = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGENES.includes(origen) ? origen : ORIGENES[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const h = cabeceras(req);
  const responder = (datos: unknown, estado = 200) => new Response(JSON.stringify(datos), { status: estado, headers: h });
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  if (req.method !== "POST") return responder({ error: "metodo" }, 405);

  // 1. La foto
  let imagen = "";
  try {
    const cuerpo = await req.json();
    imagen = String(cuerpo?.imagen ?? "").replace(/^data:image\/\w+;base64,/, "");
  } catch { /* cuerpo no válido */ }
  if (!imagen) return responder({ error: "sin_imagen" }, 400);
  if (imagen.length > MAX_BASE64) return responder({ error: "imagen_grande" }, 413);

  // 2. Los límites, como el usuario que ha entrado (su sesión va en Authorization)
  const url = Deno.env.get("SUPABASE_URL")!;
  const apikey = req.headers.get("apikey") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
  const auth = req.headers.get("authorization") ?? "";
  const r = await fetch(`${url}/rest/v1/rpc/gastar_lectura_foto`, {
    method: "POST",
    headers: { apikey, Authorization: auth, "Content-Type": "application/json" },
    body: "{}",
  });
  if (!r.ok) return responder({ error: "limites", detalle: r.status }, 500);
  const permiso = await r.json();
  if (permiso !== "ok") return responder({ error: permiso });

  // 3. Google Cloud Vision
  const clave = Deno.env.get("GOOGLE_VISION_KEY");
  if (!clave) return responder({ error: "sin_clave" }, 500);
  const g = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${clave}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [{
        image: { content: imagen },
        features: [{ type: "TEXT_DETECTION" }],
        imageContext: { languageHints: ["en", "de", "es"] },
      }],
    }),
  });
  const datos = await g.json().catch(() => ({}));
  const res = datos?.responses?.[0];
  if (!g.ok || res?.error) {
    console.error("Vision", g.status, JSON.stringify(datos?.error ?? res?.error ?? {}));
    return responder({ error: "google" }, 502);
  }
  const texto = res?.fullTextAnnotation?.text ?? res?.textAnnotations?.[0]?.description ?? "";
  return responder({ texto });
});
