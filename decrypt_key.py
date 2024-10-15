# Decrypt an encrypted key using a private key
import hashlib
import hmac
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import binascii


def decrypt_with_private_key(encrypted_data: str, private_key: str) -> str:
    # Remove '0x' prefix if present
    private_key = private_key[2:] if private_key.startswith("0x") else private_key
    encrypted_data = encrypted_data[2:] if encrypted_data.startswith("0x") else encrypted_data

    # Convert hex strings to bytes
    private_key_bytes = binascii.unhexlify(private_key)
    encrypted_data_bytes = binascii.unhexlify(encrypted_data)

    # Parse the encrypted data
    iv = encrypted_data_bytes[:16]
    ephemPublicKey = encrypted_data_bytes[16:81]
    ciphertext = encrypted_data_bytes[81:-32]
    mac = encrypted_data_bytes[-32:]

    # Load the private key
    private_key = ec.derive_private_key(
        int.from_bytes(private_key_bytes, byteorder='big'),
        ec.SECP256K1(),
        default_backend()
    )

    # Load the ephemeral public key
    ephemeral_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
        ec.SECP256K1(),
        ephemPublicKey
    )

    # Perform ECDH to get the shared secret
    shared_key = private_key.exchange(ec.ECDH(), ephemeral_public_key)

    # Derive encryption and MAC keys
    hash_key = hashlib.sha512(shared_key).digest()
    enc_key = hash_key[:32]
    mac_key = hash_key[32:]

    # Verify MAC
    dataToMac = iv + ephemPublicKey + ciphertext
    calculated_mac = hmac.new(mac_key, dataToMac, hashlib.sha256).digest()
    if not hmac.compare_digest(calculated_mac, mac):
        raise ValueError("Invalid MAC")

    # Decrypt
    cipher = Cipher(algorithms.AES(enc_key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove PKCS7 padding
    padding_length = decrypted[-1]
    decrypted = decrypted[:-padding_length]

    return decrypted.decode('utf-8')


# Example usage
encrypted_data = "d22c0ec2139e0e5b30af989cf320ec7f0455732bd1776f8249992d00b21ae0c12724448cff74e6b9ab7f92179d25ccb302f74224724921a1b37540d15200a24f72ac6da53ea677a6a4d5a3bb434cce1558332eb0fdfefed99d7e7129fca8f96ea59b5ab75f51d8d2d9fafa3e6aa3e700b1caea99e9d9b4e11ec778ce07fd77b8fd5e383654c68eab8a5dec665ab4616c3f07178291c1893d3ca24628921384ada76c6bff3705f24c40651587db3ee3eb777b164666a49aee656cbf6c0ae25c5426447c7d61db305c75b56e38e6aab154e5c99ec97955b2cf002963ca67dee70b43183655d12d201f1f48292c03eda22178d0d6cf6ed1dccd7586088e07493f257f"
private_key = "enter_your_private_key"

try:
    decrypted_text = decrypt_with_private_key(encrypted_data, private_key)
    print("Decrypted text:", decrypted_text)
except Exception as e:
    print("Decryption failed:", str(e))