import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.0.63',
    'localhost:3000',
    '192.168.0.*', // Permite qualquer IP da sua faixa de rede local
  ],
}

export default nextConfig