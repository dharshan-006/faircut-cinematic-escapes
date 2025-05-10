
// supabase/functions/send-otp/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Configure SMTP client
    const client = new SmtpClient();
    
    try {
      await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: "faircutorg@gmail.com",
        password: "swuu nxru wcdb fqdr", // App password
      });

      // Send email
      await client.send({
        from: "Fair-Cut <faircutorg@gmail.com>",
        to: email,
        subject: "Your Fair-Cut OTP Code",
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #8B5CF6; border-radius: 10px;">
            <h2 style="color: #8B5CF6; text-align: center;">Fair-Cut Authentication</h2>
            <p style="margin-bottom: 20px; text-align: center;">Your one-time password for Fair-Cut app login:</p>
            <div style="background-color: #2D1A54; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; border-radius: 5px; letter-spacing: 5px;">
              ${otp}
            </div>
            <p style="color: #666; text-align: center; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
        `,
        html: true,
      });

      await client.close();

      console.log(`Successfully sent OTP email to ${email}`);
      
      return new Response(
        JSON.stringify({ 
          message: "OTP sent successfully", 
          otp: otp // In a real app, we'd never return this but for testing purposes
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (emailError) {
      console.error("SMTP Error:", emailError);
      await client.close();
      throw new Error(`SMTP Error: ${emailError.message}`);
    }

  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send OTP" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
