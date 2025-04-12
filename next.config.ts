import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            butterutil: "commonjs bufferutil"
        });

        return config;
    },
 images:{
  domains:["uploadthing.com",'hayam6fxiw.ufs.sh']
 }
};

export default nextConfig;
