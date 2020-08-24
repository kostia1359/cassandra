export const removeFrozen = (str: string): string => {
    const frozenIndex = str.indexOf('frozen<') + 7;

    if (frozenIndex === 6) {
        return str;
    }

    let unclosedTags = 1;
    let index = frozenIndex;

    while (unclosedTags) {
        if (str[index] === '<') {
            unclosedTags++;
        }

        if (str[index] === '>') {
            unclosedTags--;
        }
        index++;
    }

    return removeFrozen(
        str.slice(0, frozenIndex - 7)
            .concat(str.slice(frozenIndex, index - 1))
            .concat(str.slice(index, str.length))
    );
}