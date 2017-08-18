const operands = {
    eql: {
        type: 'string|number',
        style: 'filed_name:$value'

    },
    inList: {
        type: 'array',
        style: "filed_name:[$values...]"
    },
    exList: {
        type: 'array',
        style: "filed_name:{'!':[$values]}" // todo not sure check in waterline documents
    }
}