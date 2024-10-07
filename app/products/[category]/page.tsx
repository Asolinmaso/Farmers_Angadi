import SeparateCategory from "@/components/Molecules/category"

export default function UniqueCategoryproductPage ({params}: { params: { category: string } }) {
    return (
        <SeparateCategory params={params}/>
    )
}
