import fs from 'fs';

//Oops Implementation
class SecretSantaGame {
  inputFilePath: string = './src/input/employee.csv';
  outputFilePath: string = './src/output/secretsantagame.csv';
  previousFilePath: string = './src/output/previousgamereport.csv';
  encodingMethod: BufferEncoding = 'utf-8';
  inputEmployeeCSVFormat: string = '';
  secretSantaPicker: Array<string>;
  previousSecretSantaChilds: { [key: string]: string } = {};

  constructor() {
    const inputFile = fs.readFileSync(this.inputFilePath, {
      //Read Input File
      encoding: this.encodingMethod,
    });

    this.inputEmployeeCSVFormat = inputFile;

    this.secretSantaPicker = this.convertDataFromCSVFormat();

    let previousOutput: string | null = '';

    try {
      previousOutput = fs.readFileSync(this.outputFilePath, {
        encoding: this.encodingMethod,
      });
    } catch (error: any) {
      console.log('error in constructor2', error.message);
    }

    if (previousOutput) {
      previousOutput
        .trim()
        .split('\n')
        .forEach((secretSantaStr: string) => {
          const secretSantaArr = secretSantaStr.split(',');

          this.previousSecretSantaChilds = {
            ...this.previousSecretSantaChilds,
            [`${secretSantaArr[0]},${secretSantaArr[1]}`]: `${secretSantaArr[2]},${secretSantaArr[3]}`, //Saves details of employee and child
          };
        });
    }
  }

  public get value(): string {
    return this.inputEmployeeCSVFormat;
  }

  // Generate Employees Child

  //Implementation

  //1. Map through array of strings  2. Each loop have a function that pop a string from another array  and check for previous employee SChild or a same employee.
  // 3. if it is failed in condition then recursion it 4. if success return string 5. write array of string to new csv output file
  public generateEmployeesSecretChild() {
    const employeeData = this.convertDataFromCSVFormat();

    const assignedChilds = employeeData.map((employee: string) => {
      const pickedChild = this.selectSecretSantaChild(employee);

      return `${employee},${pickedChild}`;
    });

    // this.savePreviousSecretSantaChilds(assignedChilds);

    assignedChilds.unshift(
      'Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID'
    );

    this.savePreviousSecretSantaChilds();

    fs.writeFileSync(this.outputFilePath, assignedChilds.join('\n'), {
      encoding: this.encodingMethod,
    });
  }

  private savePreviousSecretSantaChilds() {
    try {
      const previousOutput = fs.readFileSync(this.outputFilePath, {
        encoding: this.encodingMethod,
      });

      if (previousOutput) {
        fs.writeFileSync(this.previousFilePath, previousOutput, {
          encoding: this.encodingMethod,
        });
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  }

  //Constraint check
  private isPreviousChildSameAsCurrentChild(
    currentChild: string,
    employee: string
  ): boolean {
    if (Object.keys(this.previousSecretSantaChilds).length === 0) {
      return false;
    }

    if (currentChild !== this.previousSecretSantaChilds[employee]) {
      return false;
    }

    return true; //same child is previously assigned
  }

  private convertDataFromCSVFormat(): Array<string> {
    const data = this.inputEmployeeCSVFormat.trim().split('\n');

    data.shift();

    return data;
  }

  private selectSecretSantaChild(currentEmployee: string): string {
    if (this.secretSantaPicker.length === 0) throw new Error('Picker is empty');

    const pick: string = this.secretSantaPicker.pop() as string;

    if (
      currentEmployee === pick ||
      this.isPreviousChildSameAsCurrentChild(pick, currentEmployee)
    ) {
      //Todo - Add previous child condition
      this.secretSantaPicker.unshift(pick); //shift the failed child to begining of the array
      return this.selectSecretSantaChild(currentEmployee); //Recursion - Again same function runs with different child
    }

    return pick;
  }
}

const game = new SecretSantaGame(); //Reads CSV file sync

game.generateEmployeesSecretChild(); //Generates New CSV File
