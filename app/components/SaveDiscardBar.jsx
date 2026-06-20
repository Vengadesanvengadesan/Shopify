
export function SaveDiscardBar({
  isDirty,
  isSubmitting,
  onSave,
  onDiscard,
  errorMessage,
  successMessage,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      {errorMessage && (
        <span style={{ color: "red", fontSize: "13px", alignSelf: "center" }}>
          {errorMessage}
        </span>
      )}

      {successMessage && !errorMessage && (
        <span style={{ color: "green", fontSize: "13px", alignSelf: "center" }}>
          {successMessage}
        </span>
      )}

      <button
        type="button"
        onClick={onDiscard}
        disabled={!isDirty || isSubmitting}
        style={{
          padding: "8px 18px",
          backgroundColor: !isDirty || isSubmitting ? "#8a9185" : "#ba0d0d",
          color: !isDirty || isSubmitting ? "#999" : "#333",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: !isDirty || isSubmitting ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        Discard
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSubmitting}
        style={{
          padding: "8px 18px",
          backgroundColor: !isDirty || isSubmitting ? "#ccc" : "#008060",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: !isDirty || isSubmitting ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}