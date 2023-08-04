import exprees, { Application, Request, Response } from 'express'
import cors from 'cors'
import { allStops, busArrival } from './fetchData.js'

// allStops()
const app: Application = exprees()

const PORT: number = 3002

// app.use('/',(req:Request, res:Response)=>{
//     res.send('test')
// })

const corsOptions: cors.CorsOptions = {
    origin: '*'
}

app.use(cors(corsOptions))
// app.use(exprees.json())

app.use(exprees.static('dist'))

app.get('/',(req:Request, res:Response)=>{
    res.send({"root":"api"})
})

app.get('/all-stops', (req: Request, res: Response) => {
    allStops().then(data => (res.send(data)))

})

app.post('/bus-arrival', async (req: Request, res: Response) => {
    // const reqJson: object | any = res.json()
    const stopCodesString:string|any = req?.query?.stopCodes
    const stopCodes: Array<string> = JSON.parse(stopCodesString)
    let busArrivals:Array<object> = []
    console.log(typeof stopCodes, stopCodes)
    if (stopCodes) {
        for (const stopCode of stopCodes) {
            busArrivals = [...busArrivals, await busArrival(stopCode)]
            // busArrival(reqQuery).then(data => (res.send(data)))
        }
        res.send(busArrivals)
        
    } else {
        // res.status(200)
    }
})

app.listen(PORT, () => { console.log('server started') })
