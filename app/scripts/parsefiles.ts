

class FileParser {

  private parsedFiles: Map<string, string> = new Map();

  async parse(files: File[] | File){
    if (!files) return [];
    try {
      for await (const file of files){
        if (this.parsedFiles.has(file.name)) {
          return this.parsedFiles.get(file.name);
        }
        const parsed = await this.parseFile(file);
        this.parsedFiles.set(file.name, parsed);
      }
    } catch (error) {
      throw error;
    } finally {
      return files.map(file=> this.parsedFiles.get(file.name))
    }
  }

  private async compareTextFiles(file1, file2) {
      // Read both files as text
      const text1 = await readFileAsText(file1);
      const text2 = await readFileAsText(file2);

      // Simple strict comparison
      return text1 === text2;
  }

   private async readFileAsText(file) {
       return new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result);
           reader.onerror = reject;
           reader.readAsText(file);
       });
   }

  private async parseFiles(files: File[] | null): Promise<string[]> {
    console.log("linea 15 parsefiles: \n",files)
    const promises = files.map(file=> new Promise((resolve) => resolve(this.readFileAsText(file))))
    const result = Promise.all(promises);
    return result.map(res => `[File: ${res}]`)
  }

  private async parseFile(file: File | null): Promise<string | null> {
    console.log("linea 21: parseFiles \n",file)
    const parsed = await this.readFileAsText(file);
    return [`[File: ${parsed}]`]
  }
}

export default new FileParser();
