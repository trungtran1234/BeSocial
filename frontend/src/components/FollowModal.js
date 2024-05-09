function FollowModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{title}</h2>
                <div className = "modal-inner-content"> 
                    <div className="modal-list">{children}</div>
                </div>
                <button className="modal-close" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default FollowModal;
