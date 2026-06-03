namespace ToDoApp.Models.Task
{
    public class TaskPagedResultDto
    {
        public IEnumerable<TaskDto> Items { get; set; } = new List<TaskDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}