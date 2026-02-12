import express from "express";

const router  = express.Router()

router.get("/test", (req, res) => {
    res.status(200).json({ message: "Webhook endpoint is active (GET). Use POST for actual payloads." });
});

router.post("/test",(req,res)=>{
    console.log("GitHub Webhook Received")
    console.log(req.body)

    res.status(200).json({received:true})
})

export default router;