export default function Header(props) {
  return (
    <div>
      <h1 className="bg-primary p-2 text-white">{ props.title }</h1>
    </div>
  )
}