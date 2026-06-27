export default function UstazDetailPage({ params }: { params: { ustazId: string } }) {
  const { ustazId } = params; // ✅ matches folder name
  return(
    <div>
      {ustazId}
    </div>
  )
}