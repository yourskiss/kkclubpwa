export default function Loader({message}) {
    return (
      <div className="loader">
          <div>
            <aside></aside>
            <h2>{message}</h2>
            <p>Please wait...</p>
          </div>
      </div>
    )
  }
  