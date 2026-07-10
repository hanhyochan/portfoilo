import PropTypes from 'prop-types'
import Page1Content1 from './contents/Page1Content1'
import Page1Content2 from './contents/Page1Content2'
import Page1Content3 from './contents/Page1Content3'

const page1Sections = [
  {
    text: '퍼블하는 디자이너',
    softText: '한효찬입니다.',
    Content: Page1Content1,
  },
  {
    text: '주 사용 툴',
    Content: Page1Content2,
  },
  {
    text: '디자인 시스템',
    Content: Page1Content3,
  },
]

const formatSectionNumber = (index) => String(index + 1).padStart(2, '0')

export const PAGE1_STEP_COUNT = page1Sections.length

function Page1({ activeIndex, isActive }) {
  const activeItem = page1Sections[activeIndex]
  const ActiveContent = activeItem.Content
  const activeNumber = formatSectionNumber(activeIndex)

  return (
    <section
      aria-hidden={!isActive}
      aria-label="첫 번째 페이지: 포트폴리오 인덱스"
      className="container_page container_index"
    >
      <ol className="wrapper_index" aria-label="섹션 인덱스">
        {page1Sections.map((item, index) => {
          const isCurrent = activeIndex === index
          const number = formatSectionNumber(index)

          return (
            <li
              aria-current={isCurrent && isActive ? 'step' : undefined}
              className="item_index"
              id={`index-${number}`}
              key={item.text}
            >
              <span className="text_index_number">{number}.</span>
              <span className="text_index_label">
                {item.text}
                {item.softText && (
                  <>
                    {' '}
                    <span className="text_index_soft">{item.softText}</span>
                  </>
                )}
              </span>
            </li>
          )
        })}
      </ol>

      <section
        aria-labelledby={`index-${activeNumber}`}
        aria-live="polite"
        className="box_index_content"
      >
        <ActiveContent />
      </section>
    </section>
  )
}

Page1.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
}

export default Page1
