export const styles = {
    app: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2rem 1.5rem",
        fontFamily: "Georgia, serif"
    },

    header: {
        borderBottom: "1px solid #ddd",
        paddingBottom: "1rem",
        marginBottom: "2rem"
    },

    title: {
        fontSize: 28,
        fontWeight: 500,
        color: "var(--color-text-primary)",
        margin: 0,
        letterSpacing: "-0.5px"
    },

    subtitle: {
        fontSize: 13,
        color: "var(--color-text-secondary)",
        margin: "4px 0 0"
    },

    toolbar: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "1.5rem"
    },

    btn: {
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: "var(--border-radius-md)",
        border: "1px solid #ccc", // visible for all
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)",
        transition: "all 0.15s ease"
    },

    btnDanger: {
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        borderRadius: "var(--border-radius-md)",
        border: "1px solid #A32D2D",
        background: "var(--color-background-primary)",
        color: "#A32D2D"
    },

    divider: {
        width: "1px",
        height: 24,
        background: "#ddd"
    },

    filterGroup: {
        display: "flex",
        alignItems: "center",
        gap: 8
    },

    label: {
        fontSize: 13,
        color: "var(--color-text-secondary)"
    },

    input: {
        padding: "7px 10px",
        fontSize: 13,
        border: "1px solid #ccc",
        borderRadius: "var(--border-radius-md)",
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)"
    },

    status: {
        fontSize: 13,
        color: "var(--color-text-secondary)",
        marginBottom: "1.5rem"
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        marginBottom: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    },

    mapWrapper: {
        borderRadius: "var(--border-radius-lg)",
        overflow: "hidden",
        border: "1px solid #ddd",
        marginBottom: "2rem"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13
    },

    th: {
        textAlign: "left",
        padding: "10px 12px",
        borderBottom: "1px solid #ddd",
        color: "var(--color-text-secondary)",
        fontWeight: 500,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    },

    td: {
        padding: "10px 12px",
        borderBottom: "1px solid #eee",
        color: "var(--color-text-primary)"
    },

    magBadge: (mag) => ({
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "var(--border-radius-md)",
        fontSize: 12,
        fontWeight: 500,
        background: mag >= 5 ? "#FCEBEB" : mag >= 3 ? "#FAEEDA" : "#EAF3DE",
        color: mag >= 5 ? "#A32D2D" : mag >= 3 ? "#854F0B" : "#3B6D11"
    })
};