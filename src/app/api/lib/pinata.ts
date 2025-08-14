/* eslint-disable @typescript-eslint/no-explicit-any */
// import PinataClient from '@pinata/sdk';

// const pinata = new PinataClient({
//   pinataApiKey: process.env.PINATA_API_KEY!,
// //   pianataGateway: 'copper-main-mockingbird-498.mypinata.cloud',
// });

// export async function pinFileToPinata(file: File): Promise<string> {
//   try {
//     const upload = await pinata.pinFileToIPFS(file.stream() as any);
//     return `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;
//   } catch (error) {
//     console.error('Pinata upload error:', error);
//     throw new Error('Failed to upload file to Pinata');
//   }
// }


// lib/pinata.ts
import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT as string,
  pinataGateway: process.env.PINATA_GATEWAY as string,
});

export async function uploadToPinata(file: File) {
  try {
    const upload = await pinata.upload.public.file(file as any); // Casting for compatibility
    return `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
  } catch (err) {
    console.error("Error uploading to Pinata:", err);
    throw new Error("Failed to upload file to Pinata");
  }
}
