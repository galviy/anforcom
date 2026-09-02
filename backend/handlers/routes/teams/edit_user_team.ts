import { TeamRepository } from "../../../DB/repositories";

const authRepo = new TeamRepository();

const allowedExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

export async function handler(req: Request, json?: any): Promise<Response> {
  
  if (req.method !== "POST") {
    return new Response(null, { status: 404 });
  }

  const text = await req.text();
    return Response.json({ success: false, error: "Maaf fitur ini sudah didisable mohon untuk contact support untuk informasi lebih lanjut, terima kasih untuk antusiasnya" }, { status: 401 })

  if (!text) {
    return Response.json(
      { success: false, error: "Invalid data struct??" },
      { status: 400 }
    );
  }

  const body = JSON.parse(text);

  const { tim_id, user_id, editCase } = body;

  if (!tim_id || !user_id || !editCase) {
    return Response.json(
      { success: false, error: "Invalid data struct??" },
      { status: 401 }
    );
  }

  const result = await authRepo.timIdCheck(
    json.userId,
    Number(tim_id)
  );

  if (result.length === 0) {
    return Response.json(
      {
        success: false,
        error: "hayo pentester kah bang??",
      },
      {
        status: 403,
      }
    );
  }

  switch (editCase) {
    case "editNama": {
      const { nama_baru } = body;

      if (!nama_baru) {
        return Response.json(
          {
            success: false,
            error: "Invalid data struct??",
          },
          {
            status: 401,
          }
        );
      }

      if (nama_baru.length > 250) {
        return Response.json(
          {
            success: false,
            error: "Gk kepanjangan itu broo",
          },
          {
            status: 401,
          }
        );
      }

      const gantiNama = await authRepo.updateNama_lengkap(
        Number(tim_id),
        Number(user_id),
        nama_baru
      );

      return Response.json(gantiNama);
    }

    case "asal_instansi": {
      const { asal_instansi_baru } = body;

      if (!asal_instansi_baru) {
        return Response.json(
          {
            success: false,
            error: "Invalid data struct??",
          },
          {
            status: 401,
          }
        );
      }

      if (asal_instansi_baru.length > 250) {
        return Response.json(
          {
            success: false,
            error: "Gk kepanjangan itu broo",
          },
          {
            status: 401,
          }
        );
      }

      const gantiInstansi = await authRepo.updateAsalInstansi(
        Number(tim_id),
        Number(user_id),
        asal_instansi_baru
      );

      return Response.json(gantiInstansi);
    }

    case "nomor_induk": {
      const { nomor_induk_baru } = body;

      if (!nomor_induk_baru) {
        return Response.json(
          {
            success: false,
            error: "Invalid data struct??",
          },
          {
            status: 401,
          }
        );
      }

      if (nomor_induk_baru.length > 30) {
        return Response.json(
          {
            success: false,
            error: "Gk kepanjangan itu broo",
          },
          {
            status: 401,
          }
        );
      }

      const gantiNomorInduk = await authRepo.update_nomor_induk(
        Number(tim_id),
        Number(user_id),
        nomor_induk_baru
      );

      return Response.json(gantiNomorInduk);
    }

    case "foto_baru": {
      const { file_name, foto_base64 } = body;

      if (!file_name || !foto_base64) {
        return Response.json(
          {
            success: false,
            error: "Invalid data struct??",
          },
          {
            status: 401,
          }
        );
      }

      const ext = file_name.split(".").pop()?.toLowerCase() ?? "";

      if (!allowedExtensions.has(ext)) {
        return Response.json(
          {
            success: false,
            error: "Format foto tidak didukung",
          },
          {
            status: 400,
          }
        );
      }

      const nama_file = `${crypto.randomUUID()}.${ext}`;

      const uploadResult = await authRepo.update_ktm_file(
        Number(tim_id),
        Number(user_id),
        nama_file,
        foto_base64
      );

      return Response.json({
        ...uploadResult,
        nama_file,
      });
    }

    default:
      return Response.json(
        {
          success: false,
          error: "Invalid editCase struct??",
        },
        {
          status: 401,
        }
      );
  }
  
}