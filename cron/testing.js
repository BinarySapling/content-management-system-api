import cron from "node-cron";


export const testing= () =>{
    cron.schedule("21 15 *  * *",()=>{
        console.log("running testing")
    })
}

