import { useEffect, useState } from "react"
import type { APIData } from "../types"



export default  function useFetch(url: string, page: number) {

  const [isLoading, setIsLoading] = useState(false)
  const [dataFromAPI, setDataFromAPI] = useState<APIData[]>([])
  const [totalRecordsForPagination, setTotalRecordsForPagination] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${url}?page=${page}`)
        const data = await res.json()
        console.log("Checking fetched data", data)
        setDataFromAPI(data.data)
        console.log("Checking data inside data", data.data);
        setTotalRecordsForPagination(data.pagination.total)
        console.log("checking pagination available", data.pagination.total);
      } catch (error) {
        console.error("API error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  },[url,page])

  return { isLoading, dataFromAPI, totalRecordsForPagination, setIsLoading }
}