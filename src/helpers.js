export const createElements = () => {

    const tag = (type, selector=null, inner=null) => {
        const tag = document.createElement(type)

        if (selector != null) {
            _setAttributes(tag, selector);
        }

        (inner != null) ? tag.innerHTML = inner : {};

        return tag
    }

    const image = (img, selector) => {
        const i = new Image();
        i.src = img
        _setAttributes(i, selector)
        return i
    }

    const div = (selector, html) => {
        const d = document.createElement("div")
        d.innerHTML = html
        _setAttributes(d, selector)
        return d
    }

    const _setAttributes = (element, selector) => {
        for (const key in selector) {
            element.setAttribute(key, selector[key])
        }
    }

    return {tag, image, div}
}

export const toggleElement = (element, visible, display) => {
    element.style.visibility = visible
    element.style.display = display
}

