import PropTypes from 'prop-types'

function Page3({ isActive }) {
  return (
    <section
      aria-hidden={!isActive}
      aria-label="3번째 페이지"
      className="container_page"
    >
      <h2 className="title_page">3번째 페이지</h2>
    </section>
  )
}

Page3.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

export default Page3
