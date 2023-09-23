// const { config } = require('process')

/** @type {import('next').NextConfig} */
module.exports  = {
    reactStrictMode: false,
    webpack5: true,
    images: {
        domains: ['lh3.googleusercontent.com', "avatars.githubusercontent.com", "images.unsplash.com", "plus.unsplash.com", "scontent.cdninstagram.com", "icons.veryicon.com", "static.thenounproject.com", "ffjwdzhqltegyrmrgeyq.supabase.co"],
    },
    webpack: (config) => {
        config.resolve.fallback = {fs: false}
        return config
    }
}


