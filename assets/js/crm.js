// CRM Kanban Drag and Drop JavaScript Logic
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');

    let draggedCard = null;

    cards.forEach(card => {
        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', function(e) {
            draggedCard = this;
            setTimeout(() => this.style.opacity = '0.5', 0);
        });

        card.addEventListener('dragend', function() {
            this.style.opacity = '1';
            draggedCard = null;
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = '#cbd5e1';
        });

        column.addEventListener('dragleave', function() {
            this.style.background = '#e2e8f0';
        });

        column.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '#e2e8f0';

            if (draggedCard) {
                const container = this.querySelector('.kanban-cards-container');
                container.appendChild(draggedCard);

                const leadId = draggedCard.getAttribute('data-lead-id');
                const newStatusId = this.getAttribute('data-status-id');

                // Update lead status via AJAX
                fetch(BASE_URL + 'api/lead_status.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `lead_id=${leadId}&status_id=${newStatusId}`
                })
                .then(res => res.json())
                .then(res => {
                    if (!res.status) {
                        alert('Failed to update lead status: ' + res.message);
                    }
                })
                .catch(err => console.error('Status update error:', err));
            }
        });
    });
});
