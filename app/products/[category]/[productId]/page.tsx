import IndividualProductView from "@/components/Molecules/individualCard";

export default function IndividualProductdataPage ({params}: {
    params: {productId: string, category: string} }){
        return (
            <IndividualProductView params={params}/>
        )
}