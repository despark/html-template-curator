<?php namespace Despark;

class DesparkHelpers {
    /**
     * UTF8_transliterate_to_ascii.
     *
     * @author    Kohana Team
     * @copyright (c) 2007-2012 Kohana Team
     * @copyright (c) 2005 Harry Fuecks
     * @license   http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt
     */
    static function Utf8TransliterateToAscii($str, $case = 0)
    {
        static $utf8_lower_accents = null;
        static $utf8_upper_accents = null;

        if ($case <= 0) {
            if ($utf8_lower_accents === null) {
                $utf8_lower_accents = array(
                'à' => 'a',  'ô' => 'o',  'ď' => 'd',  'ḟ' => 'f',  'ë' => 'e',  'š' => 's',  'ơ' => 'o',
                'ß' => 'ss', 'ă' => 'a',  'ř' => 'r',  'ț' => 't',  'ň' => 'n',  'ā' => 'a',  'ķ' => 'k',
                'ŝ' => 's',  'ỳ' => 'y',  'ņ' => 'n',  'ĺ' => 'l',  'ħ' => 'h',  'ṗ' => 'p',  'ó' => 'o',
                'ú' => 'u',  'ě' => 'e',  'é' => 'e',  'ç' => 'c',  'ẁ' => 'w',  'ċ' => 'c',  'õ' => 'o',
                'ṡ' => 's',  'ø' => 'o',  'ģ' => 'g',  'ŧ' => 't',  'ș' => 's',  'ė' => 'e',  'ĉ' => 'c',
                'ś' => 's',  'î' => 'i',  'ű' => 'u',  'ć' => 'c',  'ę' => 'e',  'ŵ' => 'w',  'ṫ' => 't',
                'ū' => 'u',  'č' => 'c',  'ö' => 'o',  'è' => 'e',  'ŷ' => 'y',  'ą' => 'a',  'ł' => 'l',
                'ų' => 'u',  'ů' => 'u',  'ş' => 's',  'ğ' => 'g',  'ļ' => 'l',  'ƒ' => 'f',  'ž' => 'z',
                'ẃ' => 'w',  'ḃ' => 'b',  'å' => 'a',  'ì' => 'i',  'ï' => 'i',  'ḋ' => 'd',  'ť' => 't',
                'ŗ' => 'r',  'ä' => 'a',  'í' => 'i',  'ŕ' => 'r',  'ê' => 'e',  'ü' => 'u',  'ò' => 'o',
                'ē' => 'e',  'ñ' => 'n',  'ń' => 'n',  'ĥ' => 'h',  'ĝ' => 'g',  'đ' => 'd',  'ĵ' => 'j',
                'ÿ' => 'y',  'ũ' => 'u',  'ŭ' => 'u',  'ư' => 'u',  'ţ' => 't',  'ý' => 'y',  'ő' => 'o',
                'â' => 'a',  'ľ' => 'l',  'ẅ' => 'w',  'ż' => 'z',  'ī' => 'i',  'ã' => 'a',  'ġ' => 'g',
                'ṁ' => 'm',  'ō' => 'o',  'ĩ' => 'i',  'ù' => 'u',  'į' => 'i',  'ź' => 'z',  'á' => 'a',
                'û' => 'u',  'þ' => 'th', 'ð' => 'dh', 'æ' => 'ae', 'µ' => 'u',  'ĕ' => 'e',  'ı' => 'i',
                );
            }

            $str = str_replace(
                array_keys($utf8_lower_accents),
                array_values($utf8_lower_accents),
                $str
            );
        }

        if ($case >= 0) {
            if ($utf8_upper_accents === null) {
                $utf8_upper_accents = array(
                'À' => 'A',  'Ô' => 'O',  'Ď' => 'D',  'Ḟ' => 'F',  'Ë' => 'E',  'Š' => 'S',  'Ơ' => 'O',
                'Ă' => 'A',  'Ř' => 'R',  'Ț' => 'T',  'Ň' => 'N',  'Ā' => 'A',  'Ķ' => 'K',  'Ĕ' => 'E',
                'Ŝ' => 'S',  'Ỳ' => 'Y',  'Ņ' => 'N',  'Ĺ' => 'L',  'Ħ' => 'H',  'Ṗ' => 'P',  'Ó' => 'O',
                'Ú' => 'U',  'Ě' => 'E',  'É' => 'E',  'Ç' => 'C',  'Ẁ' => 'W',  'Ċ' => 'C',  'Õ' => 'O',
                'Ṡ' => 'S',  'Ø' => 'O',  'Ģ' => 'G',  'Ŧ' => 'T',  'Ș' => 'S',  'Ė' => 'E',  'Ĉ' => 'C',
                'Ś' => 'S',  'Î' => 'I',  'Ű' => 'U',  'Ć' => 'C',  'Ę' => 'E',  'Ŵ' => 'W',  'Ṫ' => 'T',
                'Ū' => 'U',  'Č' => 'C',  'Ö' => 'O',  'È' => 'E',  'Ŷ' => 'Y',  'Ą' => 'A',  'Ł' => 'L',
                'Ų' => 'U',  'Ů' => 'U',  'Ş' => 'S',  'Ğ' => 'G',  'Ļ' => 'L',  'Ƒ' => 'F',  'Ž' => 'Z',
                'Ẃ' => 'W',  'Ḃ' => 'B',  'Å' => 'A',  'Ì' => 'I',  'Ï' => 'I',  'Ḋ' => 'D',  'Ť' => 'T',
                'Ŗ' => 'R',  'Ä' => 'A',  'Í' => 'I',  'Ŕ' => 'R',  'Ê' => 'E',  'Ü' => 'U',  'Ò' => 'O',
                'Ē' => 'E',  'Ñ' => 'N',  'Ń' => 'N',  'Ĥ' => 'H',  'Ĝ' => 'G',  'Đ' => 'D',  'Ĵ' => 'J',
                'Ÿ' => 'Y',  'Ũ' => 'U',  'Ŭ' => 'U',  'Ư' => 'U',  'Ţ' => 'T',  'Ý' => 'Y',  'Ő' => 'O',
                'Â' => 'A',  'Ľ' => 'L',  'Ẅ' => 'W',  'Ż' => 'Z',  'Ī' => 'I',  'Ã' => 'A',  'Ġ' => 'G',
                'Ṁ' => 'M',  'Ō' => 'O',  'Ĩ' => 'I',  'Ù' => 'U',  'Į' => 'I',  'Ź' => 'Z',  'Á' => 'A',
                'Û' => 'U',  'Þ' => 'Th', 'Ð' => 'Dh', 'Æ' => 'Ae', 'İ' => 'I',
                );
            }

            $str = str_replace(
                array_keys($utf8_upper_accents),
                array_values($utf8_upper_accents),
                $str
            );
        }

        return $str;
    }

    /**
     * Convert a phrase to a URL-safe title.
     *
     *     echo string_to_filename('My Blog Post'); // "my-blog-post"
     *
     * @param string $title      Phrase to convert
     * @param string $separator  Word separator (any single character)
     * @param bool   $ascii_only Transliterate to ASCII?
     *
     * @return string
     *
     * @uses   transliterate_to_ascii
     */
    static function stringToFilename($title, $separator = '-', $ascii_only = false)
    {
        if ($ascii_only === true) {
            // Transliterate non-ASCII characters
            $title = UTF8_transliterate_to_ascii($title);

            // Remove all characters that are not the separator, a-z, 0-9, or whitespace
            $title = preg_replace('![^'.preg_quote($separator).'a-z0-9\s]+!', '', strtolower($title));
        } else {
            // Remove all characters that are not the separator, letters, numbers, or whitespace
            $title = preg_replace('![^'.preg_quote($separator).'\pL\pN\s]+!u', '', strtolower($title));
        }

        // Replace all separator characters and whitespace by a single separator
        $title = preg_replace('!['.preg_quote($separator).'\s]+!u', $separator, $title);

        // Trim separators from the beginning and end
        return trim($title, $separator);
    }

    /**
     * Remove duplicated spaces.
     *
     * @param String $string
     *
     * @return String
     */
    static function removeDuplicatedSpaces($string)
    {
        return preg_replace('/\s\s+/', ' ', trim($string));
    }

    /**
     * Get start and end date for week of given date.
     * Origin: http://stackoverflow.com/questions/923925/get-start-and-end-days-for-a-given-week-in-php
     * Start day of week: Monday
     * End day of week: Sunday.
     *
     * @param String $date
     *
     * @return Array
     */
    static function xWeekRange($date)
    {
        $ts = strtotime($date);
        $start = (date('w', $ts) == 1) ? $ts : strtotime('last monday', $ts);

        return [
            'start' => date('Y-m-d', $start),
            'end' => date('Y-m-d', strtotime('next sunday', $start)),
        ];
    }
}
