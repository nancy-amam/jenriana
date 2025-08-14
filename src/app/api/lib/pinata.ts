/* eslint-disable @typescript-eslint/no-explicit-any */
import PinataClient from '@pinata/sdk';

const pinata = new PinataClient({
  pinataJWTKey: process.env.PINATA_JWT_SECRET!,
});

export async function pinFileToPinata(file: File): Promise<string> {
  try {
    const upload = await pinata.pinFileToIPFS(file.stream() as any);
    return `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error('Failed to upload file to Pinata');
  }
}
