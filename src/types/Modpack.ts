export type VersionType = {
    name?: string;
    id?: string;
    zip?: string;
    size?: string;
    changelog?: string;
    visible?: boolean;
    date?: string;
    clean?: boolean;
}

export type ModpackType = {
    id?: string;
    name?: string;
    index?: number;
    thumbnail?: string | File;
    background?: string | File;
    mainVersion?: VersionType;
    status?: string;
    jvmArgs?: string;
    versions?: VersionType[];    
}