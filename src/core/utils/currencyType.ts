export const currency = (data:any) => {
    data = parseInt(data)
    return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}