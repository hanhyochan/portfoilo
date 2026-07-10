import PropTypes from 'prop-types'

function Page4({ isActive }) {
  return (
    <section
      aria-hidden={!isActive}
      aria-label="4번째 페이지"
      className="container_page"
    >
      <h2 className="title_page">4번째 페이지</h2>
    </section>
  )
}

Page4.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

export default Page4
