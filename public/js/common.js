$(document).ready(function() {
    $('.infrastructures-card__img').each((index, el) => {
        let height = $(el).height();
        $(el).parents('.infrastructures-card__wrap').attr('style', `min-height: ${height}px;`).data('index', index)
    })
})
