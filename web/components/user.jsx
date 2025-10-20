export function User(props) {
    return <span classList={{
        'inline-block': true,
        'text-sm': true,
        'px-2': true,
        'py-1': true,
        'rounded-full': true,
        'mr-1': true,
        'mb-1': true,
        'bg-rc/50': props.state == 0,
        'text-rf': props.state == 0,
        'bg-vc/30': props.state == 1,
        'text-vf': props.state == 1,
        'font-bold': true,
        'cursor-pointer': false
    }}> {props.user.pxx}<sup>{props.user.cotisant ? 'C' : ''}{props.user.sortiesEffectuees}</sup> {props.state == 1 ? '✓' : ''} </span>
}