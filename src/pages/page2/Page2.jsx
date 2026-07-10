import PropTypes from 'prop-types'

function Page2({ isActive }) {
  return (
    <section
      aria-hidden={!isActive}
      aria-label="2번째 페이지"
      className="container_page"
    >
      <h2 className="text_page_title">2번째 페이지</h2>
    </section>
  )
}

Page2.propTypes = {
  isActive: PropTypes.bool.isRequired,
}

export default Page2
