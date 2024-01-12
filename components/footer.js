export default function Footer(props) {
  return (
    <div>
      <h6 className="bg-primary py-3 text-white">
        { props.footer }
      </h6>
    </div>
  )
}