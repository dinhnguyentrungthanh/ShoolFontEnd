export class StringUtils {

  public static format(input: string, ...arg: Array<any>): string{
      for (let i = 0; i < arg.length; i++) {
          const regexp = new RegExp('\\{' + i + '\\}', 'gi');
          input = input.replace(regexp, arg[i]);
      }
      return input;
  }
}
