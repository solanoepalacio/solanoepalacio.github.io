'use strict'

const unrenderedElements = document.querySelectorAll('.scrollable')


window.addEventListener('scroll', function () {
  let lastOffset = 0
  unrenderedElements.forEach((element) => {
    if (element.classList.contains('active')) {
      return
    }

    const { top } = element.getBoundingClientRect()
    const windowBottomOffset = top - window.innerHeight
    if (windowBottomOffset <= - 72) {

      const currentOffset = element.offsetTop
      const segmentHeight = currentOffset - lastOffset
      lastOffset += currentOffset

      const segment = element.querySelector('.segment')
      if (segment) {
        segment.style.top = -segmentHeight + 100
        segment.style.height = segmentHeight - 70
      }

      element.classList.add('active')
    }
  })
})


