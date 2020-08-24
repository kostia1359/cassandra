const numbers={
    bigIntMax:Math.pow(2,63),
    intMax:Math.pow(2,31),
    smallIntMax:Math.pow(2,15),
    tinyIntMax:Math.pow(2,7),
    doubleMax:Math.pow(2,11),
    floatMax:Math.pow(2,8),
}

const regExps={
    ascii:'[\\\\x00-\\\\x7F]*',
    blob:'0[xX]([0-9a-fA-F]{2})+',
    date:'[0-9]{4}-((1[0-2])|(0[1-9]))-((0[1-9])|([12][1-9]|(3[01])))',
    ipv4:'((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))',
    ipv6:'((?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4})',
    time:'(([0-1]?[0-9])|(2[0-3]))(:[0-6]?[0-9]){2}(\\\\.[0-9]{1,9})?',
    uuid:'[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}'
}

const mapper={
    ascii:`{"type":"string","pattern":"^${regExps["ascii"]}$"}`,
    bigint:`{"type":"integer","minimum":-${numbers["bigIntMax"]},"maximum":${numbers["bigIntMax"]-1}}`,
    blob:`{"type":"string","pattern":"^${regExps["blob"]}$"}`,
    boolean:'{"type":"boolean"}',
    counter:`{"type":"integer","minimum":-${numbers["bigIntMax"]},"maximum":${numbers["bigIntMax"]-1}}`,
    date: `{"oneOf":[{"type":"string","pattern":"^${regExps["date"]}$"},{"type":"integer","minimum":0,"maximum":${numbers["intMax"] * 2 - 1}}]}`,
    decimal:'{"type":"number"}',
    double:`{"type":"number","minimum":-${numbers["doubleMax"]},"maximum":${numbers["doubleMax"]-1}}`,
    float:`{"type":"number","minimum":-${numbers["floatMax"]},"maximum":${numbers["floatMax"]-1}}`,
    inet:`{"oneOf":[{"type":"string","format":"ipv4"},{"type":"string","format":"ipv6"}]}`,
    int:`{"type":"integer","minimum":-${numbers["intMax"]},"maximum":${numbers["intMax"]-1}}`,
    smallint:`{"type":"integer","minimum":-${numbers["smallIntMax"]},"maximum":${numbers["smallIntMax"]-1}}`,
    text:'{"type":"string"}',
    time: `{"oneOf":[{"type":"string","pattern":"^${regExps["time"]}$"},{"type":"integer","minimum":0,"maximum":${numbers["bigIntMax"] * 2 - 1}}]}`,
    timestamp:`{"type":"string","pattern":"^${regExps["date"]} ${regExps["time"]}$"}`,
    timeuuid:`{"type":"string","pattern":"^${regExps["uuid"]}$"}`,
    tinyint:`{"type":"integer","minimum":-${numbers["tinyIntMax"]},"maximum":${numbers["tinyIntMax"]-1}}`,
    uuid:`{"type":"string","pattern":"^${regExps["uuid"]}$"}`,
    varchar:'{"type":"string"}',
    varint:'{"type":"integer"}'
}