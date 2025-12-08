export function convertToIndianWords(amount: number): string {
  const singleDigits = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  ];

  const twoDigits = [
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ];

  const tensMultiple = [
    '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
  ];

  const placeValues = [
    '', 'thousand', 'lakh', 'crore',
  ];

  if (amount === 0) return 'zero';

  const numStr = amount.toString();
  const numLength = numStr.length;

  let result = '';
  let n = amount;

  const getTwoDigitWords = (num: number): string => {
    if (num < 10) return singleDigits[num];
    if (num >= 10 && num < 20) return twoDigits[num - 10];
    return tensMultiple[Math.floor(num / 10)] + (num % 10 ? ' ' + singleDigits[num % 10] : '');
  };

  const segments: string[] = [];

  // Extract segments in Indian grouping
  segments.push((n % 1000).toString()); // Units, Tens, Hundreds
  n = Math.floor(n / 1000);

  segments.push((n % 100).toString()); // Thousands
  n = Math.floor(n / 100);

  segments.push((n % 100).toString()); // Lakhs
  n = Math.floor(n / 100);

  segments.push(n.toString()); // Crores

  const wordSegments: string[] = [];

  for (let i = segments.length - 1; i >= 0; i--) {
    const segmentValue = parseInt(segments[i]);
    if (segmentValue > 0) {
      let segmentWord = '';
      if (segmentValue < 100) {
        segmentWord = getTwoDigitWords(segmentValue);
      } else {
        const hundreds = Math.floor(segmentValue / 100);
        const rest = segmentValue % 100;
        segmentWord = singleDigits[hundreds] + ' hundred';
        if (rest > 0) {
          segmentWord += ' and ' + getTwoDigitWords(rest);
        }
      }

      if (placeValues[i]) {
        segmentWord += ' ' + placeValues[i];
      }

      wordSegments.push(segmentWord.trim());
    }
  }

  result = wordSegments.join(' ').replace(/\s+/g, ' ').trim();
  return result.charAt(0).toUpperCase() + result.slice(1);
}
