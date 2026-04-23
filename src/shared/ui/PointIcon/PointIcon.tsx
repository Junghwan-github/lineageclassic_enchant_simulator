import styles from "./PoinIcon.module.css";
type PointIconProps = {
    width: number;
}

const PointIcon = ({width}: PointIconProps) => {
    return (
        <span className={styles.point_icon} style={{width: width, height: width}}>
            P
        </span>
    )
}

export default PointIcon;