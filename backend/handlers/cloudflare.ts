interface TurnstileResponse {
    success: boolean;
    'error-codes'?: string[];
    challenge_ts?: string;
    hostname?: string;
}

class cloudflare {
    private cf_secret: any;

    constructor(cf_sikrit: any) {
        if (Bun.env.SECRET_CF == null){
            throw new Error("you require a SECRET_CF to let people login dumbass")
        }
        this.cf_secret = cf_sikrit;
    }
    public async validate_token(cf_token: string){
        try {
        const response = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret:this.cf_secret,
                    response: cf_token,
                }),
            },
        );
        const data = await response.json() as TurnstileResponse;
        if (!data.success) return {success:false, error: "Invalid cloudflare token"}
        return {success:true, message:"valid boy"}
       
        } catch (e) {
            console.error(e);
            return {success:false, error: "Gagal menghubungi layanan verifikasi Cloudflare"};
        }
    }
 
}


export const Cloudflare = new cloudflare(Bun.env.SECRET_CF)