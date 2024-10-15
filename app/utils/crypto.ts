import * as openpgp from "openpgp";

export async function clientSideEncrypt(
  file: File,
  signature: string,
): Promise<File> {
  const fileBuffer = await file.arrayBuffer();
  const message = await openpgp.createMessage({
    binary: new Uint8Array(fileBuffer),
  });

  const encrypted = await openpgp.encrypt({
    message,
    passwords: [signature],
    format: "binary",
  });

  // Convert WebStream<Uint8Array> to BlobPart
  const response = new Response(encrypted as ReadableStream<Uint8Array>);
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const encryptedBlob = new Blob([uint8Array], {
    type: "application/octet-stream",
  });
  const encryptedFile = new File(
    [encryptedBlob],
    "",
    {
      type: "application/octet-stream",
    },
  );
  return encryptedFile;
}

export async function clientSideDecrypt(encryptedFile: File, signature: string): Promise<ArrayBuffer> {
  const encryptedData = await encryptedFile.arrayBuffer();
  const message = await openpgp.readMessage({
    binaryMessage: new Uint8Array(encryptedData),
  });

  const decrypted = await openpgp.decrypt({
    message,
    passwords: [signature],
    format: "binary",
  });

  // Convert the decrypted data to an ArrayBuffer
  const response = new Response(decrypted.data as ReadableStream<Uint8Array>);
  const arrayBuffer = await response.arrayBuffer();

  return arrayBuffer;
}