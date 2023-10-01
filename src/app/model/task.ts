export class Task {
    _id: number = 0;
    title: string = '';
    description: string = '';
    dueDate: Date | null = null;
    status: boolean = false; // Using a boolean for status
    showDetails: boolean | undefined;
}
