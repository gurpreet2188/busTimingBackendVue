import 'dotenv/config'
import { URLSearchParams } from 'url'

const LTA_URL_ALL_STOPS: string | undefined = process.env.LTA_URL_ALL_STOPS
const LTA_SEARCH_STOPS: string | undefined = process.env.LTA_SEARCH_STOPS
const API_KEY: string | undefined = process.env.API_KEY

async function fetchData(url: string, searchParams: string = '') {

    const res = await fetch(url + searchParams, { headers: { 'AccountKey': API_KEY as string, 'accept': 'application/json' } })
    const data = await res.json()
    return data

}

export async function allStops() {
    let skip = 0
    let res: Array<object> = []
    while (true) {
        const searchParams = new URLSearchParams({ '$skip': `${skip}` }).toString()
        const tempRes: { 'value': Array<object> } = await fetchData(LTA_URL_ALL_STOPS as string, searchParams)
        console.log(skip)
        if (Object.keys(tempRes).includes('value')) {
            if (tempRes.value instanceof Array) {
                res = [...res, ...tempRes.value]
                if (tempRes.value.length === 0) {
                    break
                }

                skip += 500

            } else {
                break
            }
        } else {
            break
        }

    }
    return res
}

export async function busArrival(busStopCode: string) {

    const searchParams = new URLSearchParams({ 'BusStopCode': `${busStopCode}` }).toString()
    console.log(searchParams)
    const res: Response = await fetchData(LTA_SEARCH_STOPS as string, searchParams)
    return res
}
