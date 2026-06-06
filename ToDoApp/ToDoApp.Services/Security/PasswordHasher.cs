using System;
using System.Security.Cryptography;

namespace ToDoApp.Services.Security
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 128-bit salt
        private const int KeySize = 32;  // 256-bit subkey
        private const int Iterations = 100000; // PBKDF2 iterations
        private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA256;

        public static string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password cannot be null or empty.", nameof(password));

            using (var algorithm = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithm))
            {
                byte[] salt = algorithm.Salt;
                byte[] key = algorithm.GetBytes(KeySize);

                byte[] hashBytes = new byte[SaltSize + KeySize];
                Array.Copy(salt, 0, hashBytes, 0, SaltSize);
                Array.Copy(key, 0, hashBytes, SaltSize, KeySize);

                return Convert.ToBase64String(hashBytes);
            }
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hashedPassword))
                return false;

            try
            {
                byte[] hashBytes = Convert.FromBase64String(hashedPassword);
                if (hashBytes.Length != SaltSize + KeySize)
                    return false;

                byte[] salt = new byte[SaltSize];
                Array.Copy(hashBytes, 0, salt, 0, SaltSize);

                byte[] key = new byte[KeySize];
                Array.Copy(hashBytes, SaltSize, key, 0, KeySize);

                using (var algorithm = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithm))
                {
                    byte[] keyToCheck = algorithm.GetBytes(KeySize);

                    // Use fixed-time comparison to prevent timing attacks.
                    return CryptographicOperations.FixedTimeEquals(key, keyToCheck);
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
