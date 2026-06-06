using System;

namespace ToDoApp.Entities
{
    // Represents an entity that supports soft deletion.
    // Entities implementing this interface are not physically deleted from the database.
    // Instead, they are flagged as deleted and automatically filtered by global query filters.
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }

        DateTime? DeletedAt { get; set; }
    }
}
