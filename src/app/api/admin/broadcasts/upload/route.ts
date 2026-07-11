import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import type {UploadApiResponse} from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image selected." },
        { status: 400 },
      );
    }

    // Allow only image files
    const allowedTypes = ["image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, and PNG images are allowed.",
        },
        {
          status: 400,
        },
      );
    }

    // Maximum file size: 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "menmai-foods/broadcasts",
            resource_type: "image",
            overwrite: false,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Cloudinary upload failed."));
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Broadcast image upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed.",
      },
      {
        status: 500,
      },
    );
  }
}
