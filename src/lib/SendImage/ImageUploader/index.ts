"use client"

import { Signature } from "../Signature"

interface ImageUploaderProps {
  image: any
}

export const ImageUploader = async ({
  image
}: ImageUploaderProps) => {

  const { signature, timestamp } = await Signature()

  const formUpload = new FormData()
  formUpload.append("file", image)
  formUpload.append("upload_preset", "signedimage")
  formUpload.append('timestamp', String(timestamp));
  formUpload.append('signature', signature);
  formUpload.append('api_key', '612216619162431');

  const response = await fetch(`https://api.cloudinary.com/v1_1/dokdrggvz/image/upload`, {
    method: 'POST',
    body: formUpload,
  });

  if ( response.status !== 200 ) {
    return {
      status: 500,
      image: ""
    }
  }

  const imageUrl = await response.json()
  return {
    status: 200,
    image: imageUrl.secure_url
  }
}