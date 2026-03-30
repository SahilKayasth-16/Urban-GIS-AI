const BusinessTable = ({ businesses }) => {
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/business/${id}/${status}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({})
    });

    if (!res.ok) {
      throw new Error("Request failed.")
    }

    window.location.reload();
    } catch(err) {
      console.error("Update status failed.", err);
      alert("Failed to updte status");
    }
    
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>City</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {businesses.map(b => (
          <tr key={b.id}>
            <td>{b.business_name}</td>
            <td>{b.category_id}</td>
            <td>{b.city}</td>
            <td>{b.status}</td>
            <td>
              {b.status === "pending" && (
                <div className="action-btns">
                  <button onClick={() => updateStatus(b.id, "approved")}>✅</button>
                  <button onClick={() => updateStatus(b.id, "rejected")}>❌</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BusinessTable;
