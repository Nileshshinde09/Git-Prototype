type Command={
    execute():void;
}
class GitClient{
    run(command:Command):void{
        command.execute()
    }
}
export {GitClient}